export function getPagination(
  page = 1,
  limit = 20
) {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(100, Math.max(1, limit));

  return {
    skip: (safePage - 1) * safeLimit,
    take: safeLimit,
    page: safePage,
    limit: safeLimit,
  };
}