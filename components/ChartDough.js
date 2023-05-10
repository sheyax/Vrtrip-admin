import { Card, Title, DonutChart } from "@tremor/react";

const valueFormatter = (number) =>
  ` ${Intl.NumberFormat("us").format(number).toString()}`;

const ChartDough = ({ data, title }) => {
  return (
    <Card className="p-2 mt-5">
      <Title>{title}</Title>
      <DonutChart
        className="mt-6"
        data={data}
        category="trips"
        index="name"
        valueFormatter={valueFormatter}
        colors={["slate", "violet", "indigo","rose","sky","yellow","purple","teal","blue"]}
      />
    </Card>
  );
};

export default ChartDough;
