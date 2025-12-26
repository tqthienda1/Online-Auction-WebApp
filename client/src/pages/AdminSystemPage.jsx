import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { http } from "@/lib/utils";
import { AlertCircle, CheckCircle } from "lucide-react";

const AdminSystemPage = () => {
  const [systemParams, setSystemParams] = useState({
    autoExtendThreshold: 0,
    autoExtendTime: 0,
    recentlyProductTime: 0,
  });
  const [formData, setFormData] = useState({
    autoExtendThreshold: 0,
    autoExtendTime: 0,
    recentlyProductTime: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchSystemParameters();
  }, []);

  const fetchSystemParameters = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await http.get("/system/parameters");
      const data = response.data;
      setSystemParams(data);
      setFormData(data);
    } catch (err) {
      console.error("Error fetching system parameters:", err);
      setError("Failed to load system parameters. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    const newFormData = { ...formData, [field]: numValue };
    setFormData(newFormData);

    // Check if there are any changes
    const hasChanged =
      newFormData.autoExtendThreshold !== systemParams.autoExtendThreshold ||
      newFormData.autoExtendTime !== systemParams.autoExtendTime ||
      newFormData.recentlyProductTime !== systemParams.recentlyProductTime;

    setHasChanges(hasChanged);
    setSuccess(false); // Clear success message when making changes
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(false);

      // Validate inputs
      if (formData.autoExtendThreshold < 0 || formData.autoExtendTime < 0 || formData.recentlyProductTime < 0) {
        setError("All values must be non-negative numbers.");
        setIsSaving(false);
        return;
      }

      const response = await http.put("/system/parameters", formData);
      setSystemParams(response.data);
      setFormData(response.data);
      setHasChanges(false);
      setSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error updating system parameters:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update system parameters. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFormData(systemParams);
    setHasChanges(false);
    setError(null);
    setSuccess(false);
  };

  const paramConfig = [
    {
      key: "autoExtendThreshold",
      label: "Auto Extend Threshold",
      unit: "Minutes",
    },
    {
      key: "autoExtendTime",
      label: "Auto Extend Time",
      unit: "Minutes",
    },
    {
      key: "recentlyProductTime",
      label: "Recently Product Time",
      unit: "Days",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-yellow-400">System Settings</h1>
        <p className="text-muted-foreground">
          Manage system parameters and configurations
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col justify-center p-8 text-center">
          <Spinner className="size-8 w-full text-yellow-500" />
          <h3 className="font-semibold my-6 text-body">Loading system parameters...</h3>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900">Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900">Success</h3>
                <p className="text-green-700 text-sm">
                  System parameters updated successfully
                </p>
              </div>
            </div>
          )}

          {/* System Parameters Card */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>System Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {paramConfig.map((param) => (
                <div
                  key={param.key}
                  className="border-b border-border pb-6 last:border-0 last:pb-0"
                >
                  <label className="block mb-2">
                    <span className="font-semibold text-foreground">
                      {param.label}
                    </span>
                    <p className="text-sm text-muted-foreground mt-1">
                      {param.description}
                    </p>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={formData[param.key]}
                      onChange={(e) =>
                        handleInputChange(param.key, e.target.value)
                      }
                      className="flex h-10 w-32 rounded-md border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="0"
                    />
                    <span className="text-sm text-muted-foreground">
                      {param.unit}
                    </span>
                  </div>
                  {systemParams[param.key] !== formData[param.key] && (
                    <p className="text-xs text-orange-600 mt-2">
                      Current: {systemParams[param.key]} {param.unit}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              onClick={handleReset}
              disabled={!hasChanges || isSaving}
              className="px-6 bg-gray-300 text-gray-800 hover:bg-gray-400"
            >
              Reset
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="px-6 bg-yellow-400 text-white hover:bg-yellow-500"
            >
              {isSaving ? (
                <>
                  <Spinner className="size-4 mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>

        </div>
      )}
    </div>
  );
};

export default AdminSystemPage;
