export const NUMBER_PER_PG = 20;
export const getRangeValues = (pg: number, perPg?: number) => {
  const itemsPer = perPg || NUMBER_PER_PG;
  return [(pg - 1) * itemsPer, pg * itemsPer];
};

export const pgStatus = (
  currentPg: number,
  totalRecords?: number,
  perPg?: number
) => {
  const itemsPer = perPg || NUMBER_PER_PG;
  const totalPgs = Math.ceil(totalRecords || (itemsPer - 1) / itemsPer);
  return {
    hasNext: currentPg < totalPgs,
    hasBack: currentPg > 1,
    totalPgs,
    totalRecords,
    itemsPer,
  };
};
