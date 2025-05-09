import prisma from "@/lib/prisma";
import { SMAPredictor } from "./_components/sma-predictor";
import { calculateSingleMovingAverage } from "@/actions/predict";

interface Props {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}

export default async function PredictPage({ searchParams }: Props) {
  const items = await prisma.item.findMany();
  const { itemId = "", period = 3 } = await searchParams;

  let smaResult: CalculateResult | null = null;
  if (itemId && period) {
    smaResult = await calculateSingleMovingAverage(itemId, +period);
  }

  return (
    <div className="flex flex-col  bg-gray-50 dark:bg-gray-900">
      <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <SMAPredictor items={items} smaResult={smaResult} />
        </div>
      </main>
    </div>
  );
}
