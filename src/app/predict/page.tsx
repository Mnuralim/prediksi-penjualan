import prisma from "@/lib/prisma";
import { SMAPredictor } from "./_components/sma-predictor";
import {
  calculateSingleMovingAverage,
  calculateAllItemsMovingAverage,
} from "@/actions/predict";

interface Props {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}

export default async function PredictPage({ searchParams }: Props) {
  const items = await prisma.item.findMany();
  const { itemId = "", period = "3", all = "" } = await searchParams;

  let smaResults: CalculateResult[] | null = null;

  if (all === "true" && period) {
    smaResults = await calculateAllItemsMovingAverage(+period);
  } else if (itemId && period) {
    const singleResult = await calculateSingleMovingAverage(itemId, +period);
    smaResults = [singleResult];
  }

  return (
    <div className="flex flex-col bg-gray-50 dark:bg-gray-900">
      <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <SMAPredictor items={items} smaResults={smaResults} />
        </div>
      </main>
    </div>
  );
}
