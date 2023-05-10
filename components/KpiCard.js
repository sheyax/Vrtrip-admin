import {
  BadgeDelta,
  Card,
  Flex,
  Metric,
  ProgressBar,
  Text,
} from "@tremor/react";

const KpiCard = ({ title, metric, progress, target, delta, deltatype }) => {
  return (
    <Card className="max-w-lg">
      <Flex alignItems="start">
        <div>
          <Text>Sales</Text>
          <Metric>$ 5000</Metric>
        </div>

        <BadgeDelta deltaType="moderateIncrease"> 15.2%</BadgeDelta>
        {/* deltaTypes = moderateIncrease || moderateDecrease || increase || decrease */}
      </Flex>

      <Flex className="mt-4">
        <Text className="truncate"> 69% ($49,400)</Text>
        <Text> $9000 </Text>
      </Flex>
      <ProgressBar percentageValue={15.9} className="mt-2" />
    </Card>
  );
};

export default KpiCard;
