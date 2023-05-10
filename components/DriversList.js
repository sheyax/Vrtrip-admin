import { useState } from "react";
import {
  BadgeDelta,
  Card,
  DeltaType,
  Dropdown,
  DropdownItem,
  MultiSelectBox,
  MultiSelectBoxItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import apidata from "@/apidata";

const DriverList = () => {
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedNames, setSelectedNames] = useState([]);

  const isDriverSelected = (driver) =>
    (driver.company === selectedCompany || selectedCompany === "all") &&
    (selectedNames.includes(driver.username) || selectedNames.length === 0);
  return (
    <Card className="col-span-3 mt-2 p-5">
      <div className="sm:mt-6 sm:flex sm:start sm:space-x-2">
        <MultiSelectBox
          onValueChange={(value) => setSelectedNames(value)}
          placeholder="Select Driver"
          className="max-w-xs"
        >
          {apidata.map((item) => (
            <MultiSelectBoxItem
              key={item.username}
              value={item.username}
              text={item.username}
            />
          ))}
        </MultiSelectBox>
        <Dropdown
          className="max-w-xs"
          defaultValue="all"
          onValueChange={(value) => setSelectedCompany(value)}
        >
          <DropdownItem value="all" text="All Companies" />
          <DropdownItem value="Patjeda" text="Patjeda" />
          <DropdownItem value="Azma Logistics" text="Azma Logistics" />
          <DropdownItem value="Kasma" text="Kasma" />
        </Dropdown>
      </div>

      <Table className="mt-6">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell className="text-right">Company </TableHeaderCell>
            <TableHeaderCell className="text-right">
              No of Trips
            </TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {apidata
            .filter((item) => isDriverSelected(item))
            .map((item) => (
              <TableRow key={item.username} className="items-center">
                <TableCell>{item.username}</TableCell>
                <TableCell className="text-right">{item.company}</TableCell>
                <TableCell className="text-right">
                  {item.dailyTrips.length}
                </TableCell>
                <TableCell className="items-center">
                  <h1
                    className="bg-blue-500 text-white p-2 rounded-md ml-5 cursor-pointer 
                  hover:scale-105 duration-200 ease-out"
                  >
                    Details
                  </h1>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default DriverList;
