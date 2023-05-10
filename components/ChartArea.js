import { Card, Title, AreaChart } from "@tremor/react";



const dataFormatter = (number) => {
  return "Km " + Intl.NumberFormat("us").format(number).toString();
};

const ChartArea = ({title, dataChart}) => {
  
  return (
  <Card>
    <Title>{title}</Title>
    <AreaChart
      className="h-72 mt-4"
      data={dataChart}
      index="date"
      categories={["mileage"]}
      colors={["indigo"]}
      valueFormatter={dataFormatter}
    />
  </Card>)
  
};

export default ChartArea