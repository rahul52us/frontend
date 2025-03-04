'use client'
import React, { useState } from "react";
import {
  Box,
  Icon,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  MenuOptionGroup,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  MenuItemOption,
} from "@chakra-ui/react";

import { IoAccessibilitySharp } from "react-icons/io5";

import {
  FaEllipsisV
} from "react-icons/fa";


interface Action {
  id: number;
  name: string;
  type: any;
  options?: { id: string; name: string }[];
  icon?: any;
}

interface FilterProps {
  actions?: Action[];
}

export const ColumnFilter: React.FC<FilterProps> = ({ actions }) => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const groupedData: Record<string, Action[]> = {};
  actions?.forEach((item) => {
    if (!groupedData[item.type]) {
      groupedData[item.type] = [];
    }
    groupedData[item.type].push(item);
  });

  return (
    <>
      <Menu>
        <MenuButton
          as={Button}
          color="white"
          bg="transparent"
          fontSize={"20px"}
          _hover={{ bg: "transparent" }}
          _active={{ bg: "transparent" }}
        >
          <FaEllipsisV />
        </MenuButton>
        <MenuList
          bg="white"
          marginTop={"-4px"}
          // boxShadow="rgb(0 0 0 / 20%) 0px 0px 11px"
        >
          {Object.keys(groupedData).map((type, typeIndex) => (
            <>
              {groupedData[type].map((data,index : number) => (
                  <Popover
                    trigger="hover"
                    placement="right"
                    isOpen={isPopupOpen}
                    key={index}
                  >
                    <PopoverTrigger>
                      <MenuItem
                        key={data.id}
                        fontWeight="500"
                        fontSize="sm"
                        lineHeight="30px"
                        cursor="pointer"
                        bg={"white"}
                        _hover={{ bg: "teal.100" }}
                        color={"darkslategray"}
                        onMouseEnter={() => {
                          setHoveredId(data.id);
                          setIsPopupOpen(true);
                        }}
                      >
                        {data.icon && <Icon as={data.icon} marginRight="4" />}
                        {!data.icon && <Box width="8" />}

                        {data.name}

                        {data.options && (
                          <Icon as={IoAccessibilitySharp} marginLeft="auto" />
                        )}
                      </MenuItem>
                    </PopoverTrigger>

                    {data.options &&
                      data.options.length > 0 &&
                      hoveredId === data.id && (
                        <PopoverContent
                          color={"darkslategray"}
                          onMouseEnter={() => {
                            setHoveredId(data.id);
                            setIsPopupOpen(true);
                          }}
                          onMouseLeave={() => {
                            setHoveredId(null);
                            setIsPopupOpen(false);
                          }}
                        >
                          <PopoverBody>
                            <MenuOptionGroup
                              title={""}
                              type="radio"
                              onChange={() => {
                                // Handle option selection here
                              }}
                              defaultValue="1"
                            >
                              {data.options.map((option) => (
                                <MenuItemOption
                                  key={option.id}
                                  value={option.id}
                                  fontSize="sm"
                                  lineHeight="25px"
                                  _hover={{ bg: "teal.100" }}
                                >
                                  {option.name}
                                </MenuItemOption>
                              ))}
                            </MenuOptionGroup>
                          </PopoverBody>
                        </PopoverContent>
                      )}
                  </Popover>
              ))}
              {typeIndex !== Object.keys(groupedData).length - 1 && (
                <MenuDivider />
              )}
            </>
          ))}
        </MenuList>
      </Menu>
    </>
  );
};
