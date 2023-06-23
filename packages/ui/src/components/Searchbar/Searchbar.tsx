import { useSearchContext } from "@/context/SearchContext";
import {
  CloseIcon,
  IconButton,
  SearchIcon,
  TextField,
} from "@acid-info/lsd-react";
import styled from "@emotion/styled";
import { useState } from "react";

export default function Searchbar() {
  const { query, updateQuery } = useSearchContext();

  //By default the input is the text of the current search query
  const [filterQuery, setFilterQuery] = useState<string>(query);
  const withValue = filterQuery !== "";

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateQuery(filterQuery);
    }
  };

  const handleClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setFilterQuery("");
    updateQuery("");
  };

  return (
    <Wrapper>
      <TextField
        value={filterQuery}
        className="textfield"
        placeholder="Search..."
        onKeyDown={handleEnter}
        onChange={(e) => setFilterQuery(e.target.value)}
      />

      <div className="icon">
        <IconButton size="large" onClick={withValue ? handleClose : () => {}}>
          {filterQuery === "" ? (
            <SearchIcon color="primary" />
          ) : (
            <CloseIcon color="primary" />
          )}
        </IconButton>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: var(--spacing-6);
  margin-inline: -24px;
  padding-inline: var(--spacing-24);
  width: calc(100% + 48px);
  position: relative;
  transition: padding 0.2s, width 0.2s;

  .icon {
    button {
      flex-shrink: 0;
      border: none;
      cursor: pointer;
    }
  }

  .textfield {
    border: none;
    padding: unset;
    width: unset;
    height: unset;
    flex: 1 1 auto;

    input {
      border: none;
      background-color: transparent;
      width: 100%;
      outline: none;
      padding-block: var(--spacing-12);
      position: relative;
      transition: padding 0.2s;

      &:disabled {
        cursor: not-allowed;
        opacity: 0.15;
      }

      &:focus,
      &:active {
        padding-block: var(--spacing-24);
        transition: padding 0.2s;
      }
    }
  }

  &:focus-within {
    background-color: var(--grey-150);
  }
`;
