import styled from "@emotion/styled";
import { List, TextInput } from "@mantine/core";

export const ListFilterInput = styled(TextInput)`
  margin-bottom: 20px;
`;
export const StyledListContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0px auto;
`;

export const StyledList = styled(List)`
  width: 100%;
`;
export const StyledListItem = styled(List.Item, {
  shouldForwardProp: (pn: string) => pn !== "isLoading",
})<{ isLoading?: boolean }>`
  border-bottom: 1px solid
    ${({ theme, isLoading }) =>
      isLoading ? "transparent" : theme.colors.gray[2]};
  & .mantine-List-itemWrapper {
    width: 100%;
    span:nth-child(2) {
      width: 100%;
    }
  }
  .item {
    width: 100%;
  }
  .itemRow {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .ellipsis {
    max-width: 100%;
    white-space: no-wrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .w100 {
    width: 100%;
  }
  .w50 {
    width: 50%;
  }
  .alignTop {
    margin-bottom: auto;
    margin-top: 0;
  }
  .rows {
    display: flex;
    flex-direction: column;
  }
  .spaceBetween {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .inlinetwo {
    display: inline-block;
    width: 50%;
  }
`;

export const AvatarWrapper = styled.div`
  position: relative;
  .avatar {
    width: 50px;
    height: 50px;
  }
  .subIcon {
    position: absolute;
    bottom: -5px;
    right: -5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
