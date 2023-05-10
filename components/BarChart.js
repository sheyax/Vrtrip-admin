import { Card, Title, BarChart, Subtitle } from "@tremor/react";

const dataFormatter = (number) => {
  return " " + Intl.NumberFormat("us").format(number).toString();
};
const ChartBar = ({ title, subtitle, data }) => {
  return (
    <Card>
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>

      <BarChart
        data={data}
        className="mt-6"
        index="name"
        categories={["trips", "mileage"]}
        colors={["rose", "teal"]}
        valueFormatter={dataFormatter}
        yAxisWidth={30}
      />
    </Card>
  );
};

export default ChartBar;
