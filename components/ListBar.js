import { BarList, Card, Title, Bold, Flex, Text } from "@tremor/react";

const ListBar = ({ data, title }) => {
  return (
    <Card>
      <Title>{title}</Title>
      <BarList data={data} className="mt-2" color={["rose"]} />
    </Card>
  );
};

export default ListBar;
