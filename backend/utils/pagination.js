export const parsePagination = (query = {}, defaults = {}) => {
  const defaultPage = defaults.page ?? 1;
  const defaultLimit = defaults.limit ?? 10;
  const maxLimit = defaults.maxLimit ?? 50;

  const rawPage = Number.parseInt(query.page, 10);
  const rawLimit = Number.parseInt(query.limit, 10);

  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : defaultPage;
  const limitCandidate =
    Number.isInteger(rawLimit) && rawLimit > 0 ? rawLimit : defaultLimit;
  const limit = Math.min(limitCandidate, maxLimit);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const buildPaginationMeta = ({ page, limit, total }) => {
  const safeTotal = Number.isFinite(total) && total >= 0 ? total : 0;
  const totalPages = safeTotal === 0 ? 0 : Math.ceil(safeTotal / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: totalPages > page,
    hasPrevPage: page > 1 && totalPages > 0,
  };
};
