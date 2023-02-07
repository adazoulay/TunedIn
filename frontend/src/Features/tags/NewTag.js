import React from "react";
import { useState, useEffect, useRef } from "react";
import { useAddNewTagMutation } from "./tagsApiSlice";
import TagGroup from "../tags/TagGroup";
import SearchInput from "../../components/functionality/search/SearchInput";
import { HexColorPicker } from "react-colorful";
import Tag from "./Tag";

const NewTag = ({ handleModalClose }) => {
  const nameRef = useRef();
  const errRef = useRef();
  const [addNewTag, { isLoading, isSuccess, isError, error }] = useAddNewTagMutation();

  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [errMsg, setErrMsg] = useState("");

  //! Input fields
  useEffect(() => {
    nameRef.current.focus();
  }, []);

  const onNameChanged = (e) => setName(e.target.value);

  //! Tags
  const [parentSearchResults, setParentSearchResults] = useState({});
  const [childrenSearchResults, setChildrenSearchResults] = useState({});
  const [selectedParentTags, setSelectedParentTags] = useState({
    ids: [],
    entities: {},
  });
  const [selectedChildrenTags, setSelectedChildrenTags] = useState({
    ids: [],
    entities: {},
  });

  const getParentSearchResults = (result) => {
    setParentSearchResults(result);
  };
  const getChildrenSearchResults = (result) => {
    setChildrenSearchResults(result);
  };

  const getSelectedParentTags = (tagId, entity, type) => {
    if (type === "add") {
      if (!selectedParentTags.ids.includes(tagId)) {
        setSelectedParentTags((prevState) => {
          return {
            ids: [...prevState.ids, tagId],
            entities: {
              ...prevState.entities,
              [tagId]: entity,
            },
          };
        });
      }
    } else {
      setSelectedParentTags((prevState) => {
        return {
          ids: prevState.ids.filter((id) => id !== tagId),
          entities: Object.keys(prevState.entities).reduce((obj, key) => {
            if (key !== tagId) {
              obj[key] = prevState.entities[key];
            }
            return obj;
          }, {}),
        };
      });
    }
  };

  const getSelectedChildrenTags = (tagId, entity, type) => {
    if (type === "add") {
      if (!selectedChildrenTags.ids.includes(tagId)) {
        setSelectedChildrenTags((prevState) => {
          return {
            ids: [...prevState.ids, tagId],
            entities: {
              ...prevState.entities,
              [tagId]: entity,
            },
          };
        });
      }
    } else {
      setSelectedChildrenTags((prevState) => {
        return {
          ids: prevState.ids.filter((id) => id !== tagId),
          entities: Object.keys(prevState.entities).reduce((obj, key) => {
            if (key !== tagId) {
              obj[key] = prevState.entities[key];
            }
            return obj;
          }, {}),
        };
      });
    }
  };

  //! Submit
  const canSave = [name, color].every(Boolean) && !isLoading;

  //! TEST WHAT HAPPENS WHEN YOU SET SAME PARENT AND CHILD
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (canSave) {
      try {
        await addNewTag({
          name,
          color,
          parent: selectedParentTags?.ids,
          child: selectedChildrenTags?.ids,
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    if (isError) {
      setErrMsg(error.data?.message);
      errRef.current.focus();
    }
  }, [isError, error]);

  useEffect(() => {
    if (isSuccess) {
      handleModalClose();
      setName("");
      setColor("");
      setSelectedChildrenTags({});
      setSelectedParentTags({});
      setParentSearchResults({});
      setChildrenSearchResults({});
    }
  }, [isSuccess]);

  return (
    <div className='form-section'>
      <p ref={errRef} className='' aria-live='assertive'>
        {errMsg}
      </p>
      <form className='wrapper-form' onSubmit={handleSubmit}>
        <h1>New Tag</h1>
        <div className='form-row'>
          <label className='form-label' htmlFor='name'>
            Name:
          </label>
          <input
            className='form-input'
            type='text'
            id='name'
            value={name}
            onChange={onNameChanged}
            ref={nameRef}
            autoComplete='off'
            required
          />
        </div>
        <div className='form-row'>
          <label className='form-label'>Color:</label>
          <div className='tag-preview'>
            <HexColorPicker color={color} onChange={setColor} />
            <Tag tagInfo={{ color, name }} size='tag-large' />
          </div>
        </div>
        <div className='tag-form'>
          <div className='tag-col'>
            <div className='selected-label'>Parent Tags:</div>
            <SearchInput
              selectedFilter={"type-tag"}
              getSearchResults={getParentSearchResults}
            />
            {parentSearchResults && (
              <TagGroup
                getSelectedTags={getSelectedParentTags}
                type='add'
                tags={parentSearchResults}
              />
            )}
            {selectedParentTags && (
              <TagGroup
                getSelectedTags={getSelectedParentTags}
                type='remove'
                tags={selectedParentTags}
              />
            )}
          </div>
          <div className='tag-col'>
            <div className='selected-label'>Children Tags:</div>
            <SearchInput
              selectedFilter={"type-tag"}
              getSearchResults={getChildrenSearchResults}
            />{" "}
            {childrenSearchResults && (
              <TagGroup
                getSelectedTags={getSelectedChildrenTags}
                type='add'
                tags={childrenSearchResults}
              />
            )}
            {selectedChildrenTags && (
              <TagGroup
                getSelectedTags={getSelectedChildrenTags}
                type='remove'
                tags={selectedChildrenTags}
              />
            )}
          </div>
        </div>
        <button className='main-button' disabled={!canSave}>
          Create
        </button>
      </form>
    </div>
  );
};

export default NewTag;
