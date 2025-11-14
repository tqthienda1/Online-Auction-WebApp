import React from "react";
import ProfileInfo from "../components/ProfileInfo";
import ProfileReviews from "../components/ProfileReviews";

const UserProfile = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <ProfileInfo />
      <ProfileReviews />
    </div>
  );
};

export default UserProfile;
