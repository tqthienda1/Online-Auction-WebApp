import prisma from '../prismaClient.js'

export const submitRating = async ({ raterID, rateeID, productID, value, comment }) => {
	if (value !== 1 && value !== -1) {
		throw { status: 400, message: 'Rating value must be either +1 or -1' };
	}

	const isPos = value === 1;

	const existing = await prisma.rating.findUnique({ where: { productID } });

	const adjustRatee = async (deltaPos = 0, deltaNeg = 0) => {
		await prisma.user.update({
			where: { id: rateeID },
			data: { ratingPos: { increment: deltaPos }, ratingNeg: { increment: deltaNeg } },
		});
	};

	if (!existing) {
		await prisma.rating.create({
			data: {
				productID,
				raterID,
				rateeID,
				isPos,
				comment,
			},
		});

		await adjustRatee(isPos ? 1 : 0, isPos ? 0 : 1);

		return { message: 'Rating created', isPos };
	}

	if (existing.raterID !== raterID) {
		throw { status: 400, message: 'Rating for this product already exists' };
	}

	if (existing.isPos === isPos) {
		await prisma.rating.delete({ where: { productID } });
		await adjustRatee(isPos ? -1 : 0, isPos ? 0 : -1);
		return { message: 'Rating removed (toggled off)', removed: true };
	}

	await prisma.rating.update({ where: { productID }, data: { isPos, comment } });

	if (isPos) {
		await adjustRatee(1, -1);
	} else {
		await adjustRatee(-1, 1);
	}

	return { message: 'Rating updated', isPos };
};

export const getRatingForProduct = async (productID) => {
	return prisma.rating.findUnique({ where: { productID } });
};

export default {
	submitRating,
	getRatingForProduct,
};

