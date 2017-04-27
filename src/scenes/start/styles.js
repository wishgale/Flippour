import Styled from "styled-components/native";
import { Dimensions } from "react-native";
import * as Colors from "../../styles/variables";

export const Container = Styled.View`
  flex: 1
  justify-content: center;
  align-items: center;
  background-color: ${Colors.background};
`;

const halfWidth = Dimensions.get("window").width / 2;
export const Center = Styled.View`
  align-items: center;
  justify-content: center;
  width: ${halfWidth};
  height: ${halfWidth};
`;

export const Row = Styled.View`
  flex: 1;
  flex-direction: row;
`;
