import prisma from '../prismaClient.js'

export const submitRating = async ({ raterID, rateeID, productID, value, comment }) => {
	if (value !== 1 && value !== -1) {
		throw { status: 400, message: 'Rating value must be either +1 or -1' };
	}

	const isPos = value === 1;

	const existing = await prisma.rating.findUnique({ where: { productID_raterID: { productID, raterID } } });

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

	// If the same polarity is submitted again, update the comment instead of deleting the rating.
	if (existing.isPos === isPos) {
		// Update comment (no counter changes)
		await prisma.rating.update({ where: { productID_raterID: { productID, raterID } }, data: { comment } });
		return { message: 'Rating updated', isPos };
	}

	// Polarity changed: update rating and adjust counters
	await prisma.rating.update({ where: { productID_raterID: { productID, raterID } }, data: { isPos, comment } });

	if (isPos) {
		await adjustRatee(1, -1);
	} else {
		await adjustRatee(-1, 1);
	}

	return { message: 'Rating updated', isPos };
};

export const getRatingForProduct = async ({ productID, raterID }) => {
	return prisma.rating.findUnique({ where: { productID_raterID: { productID, raterID } } });
};

export default {
	submitRating,
	getRatingForProduct,
};

