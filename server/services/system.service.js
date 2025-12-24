import prisma from '../prismaClient.js'

export const getSystemParameters = async () => {
    const parameters = await prisma.systemParameter.findFirst();
    return parameters;
}

export const updateSystemParameters = async (params) => {
    const systemParam = await prisma.systemParameter.findFirst();

    if (!systemParam) {
        throw new Error("System parameters not found");
    }

    return await prisma.systemParameter.update({
        where: { id: systemParam.id },
        data: params,
    });
};
