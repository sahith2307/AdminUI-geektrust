import React, { useEffect, useState } from "react";
import { ApiCalls } from "../../services/apicalls";
import NavBar from "../../Components/NavBar/NavBar";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import "./homepage.component.scss";
import { Button, Modal } from "react-bootstrap";
import Popup from "../../Components/Popup/Popup";

type Props = {};

const HomePage = (props: Props) => {
  //state management

  const local = JSON.parse(localStorage.getItem("employee") || "[]");
  const [employee, setEmployee] = useState<Array<any>>(local);
  const [checkAll, setCheckAll] = useState<boolean>(false);
  const [pages, setPages] = useState<Array<number>>([]);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const [editDetails, setEditDetails] = useState<any>({});
  const [search, setSearch] = useState<string>("");
  const closeModal = () => setOpen(false);

  //life cycles

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem("employee") || "[]");
    local.length ? setEmployee(local) : fetchData();
    checkSelectAll(local);
  }, []);
  useEffect(() => {
    const pagination: Array<number> = [];
    const num = Math.ceil(employee.length / 10);
    for (let i = 1; i <= num; i++) {
      pagination.push(i);
    }
    setPages(pagination);
  }, [employee]);
  //api calls
  const fetchData = async () => {
    const data = await ApiCalls.get(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    );
    const addedSelect = data.map((each: any) => {
      return {
        ...each,
        select: false,
      };
    });
    localStorage.setItem("employee", JSON.stringify(addedSelect));
    const local = JSON.parse(localStorage.getItem("employee") || "[]");
    setEmployee(local);
  };

  //event functions and execute functions
  const validateEmail = (email: string) => {
    console.log(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email?.toLowerCase()
      )
    );
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email?.toLowerCase()
    );
  };

  const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    const local = JSON.parse(localStorage.getItem("employee") || "[]");

    const searched = local.filter(
      (each: any) =>
        each.name.includes(event.target.value) ||
        each.email.includes(event.target.value) ||
        each.role.includes(event.target.value)
    );
    setEmployee(searched);
    // const pagination: Array<number> = [];
    // const num = Math.ceil(searched.length / 10);
    // for (let i = 1; i <= num; i++) {
    //   pagination.push(i);
    // }
    // setPages(pagination);
  };
  const selectAll = async () => {
    setCheckAll((prev: boolean) => !prev);
    const selectedData = employee.map((each: any) => ({
      ...each,
      select: !checkAll,
    }));
    setEmployee(selectedData);
  };

  const onChangeEditDetails = (changes: any) => {
    setEditDetails((prev: any) => ({ ...prev, ...changes }));
  };
  const selectOne = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const id = event.target.id;
    const singleCheck = employee.map((each: any) =>
      each.id === id ? { ...each, select: !each.select } : { ...each }
    );
    setEmployee(singleCheck);
    checkSelectAll(singleCheck);
  };
  const checkSelectAll = (list: any) => {
    const checked = list.filter((each: any) => each.select === true);
    if (checked.length === list.length && list.length > 0) {
      setCheckAll(true);
    } else {
      setCheckAll(false);
    }
  };

  const editEmployeePopup = (employeeDetails: any) => {
    setOpen((prev) => !prev);
    setEditDetails(employeeDetails);
  };

  const deleteEmployee = (id: string) => {
    let local = JSON.parse(localStorage.getItem("employee") || "[]"); 
    const remainingLocal = local.filter((each: any) => each.id !== id);
    const remaining = employee.filter((each: any) => each.id !== id);
    localStorage.setItem("employee", JSON.stringify(remainingLocal));
    setEmployee(remaining);
  };

  const deleteSelected = () => {
    let local = JSON.parse(localStorage.getItem("employee") || "[]");
    employee.forEach((each) => {
      if (each.select) {
        local = local.filter((eachLocal: any) => eachLocal.id !== each.id);
      }
    });
    const unSelected = employee.filter((each: any) => !each.select);
    localStorage.setItem("employee", JSON.stringify(local));
    setEmployee(unSelected);
  };

  const selectPageNumber = (page: number) => {
    setSelectedPage(page);
  };
  const nextPage = () => {
    if (selectedPage !== pages.length) setSelectedPage(selectedPage + 1);
  };
  const prevPage = () => {
    if (selectedPage !== 1) setSelectedPage(selectedPage - 1);
  };

  const saveChanges = () => {
    if (
      editDetails.name &&
      editDetails.email &&
      validateEmail(editDetails.email)
    ) {
      const changes = employee.map((each: any) => {
        if (each.id === editDetails.id) {
          return { ...editDetails };
        } else {
          return { ...each };
        }
      });
      const local = JSON.parse(localStorage.getItem("employee") || "[]");

      const changesLocal = local.map((each: any) => {
        if (each.id === editDetails.id) {
          return { ...editDetails };
        } else {
          return { ...each };
        }
      });
      localStorage.setItem("employee", JSON.stringify(changesLocal));
      setEmployee(changes);
      setOpen(false);
    }
  };

  //jsx-functions

  const showListOfEmployees = () => {
    const paged = employee.slice((selectedPage - 1) * 10, selectedPage * 10);
    return paged.map((each) => {
      return (
        <tr key={each.id}>
          <td>
            <input
              title="name"
              type="checkbox"
              checked={each.select}
              id={each.id}
              onChange={selectOne}
            />
          </td>
          <td>{each.name}</td>
          <td>{each.email}</td>
          <td>{each.role}</td>

          <td className="flex justify-center">
            <button
              type="button"
              title="edit"
              className="button mr-3"
              onClick={() => editEmployeePopup(each)}
            >
              <PencilAltIcon className="h-8 w-8 text-blue-600" />
            </button>

            <button
              type="button"
              title="delete"
              onClick={() => deleteEmployee(each.id)}
            >
              <TrashIcon className="h-8 w-8 text-red-600" />
            </button>
          </td>
        </tr>
      );
    });
  };

  const deleteButton = () => {
    const selectedOrNot = employee.filter(
      (each: any) => each.select === true
    ).length;
    if (selectedOrNot > 0) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <div className=" text-center">
      <NavBar />
      <div className="w-[100%] flex justify-around ">
        <input
          placeholder="Search by Name, Email, Role"
          type="search"
          className="search-bar "
          value={search}
          onChange={onChangeSearch}
        />
        <button
          disabled={deleteButton()}
          className={`deleted-selected-button ${
            deleteButton() ? "bg-red-400" : "bg-red-500"
          } text-white font-bold p-3 m-3 `}
          type="button"
          onClick={deleteSelected}
        >
          Delete Selected
        </button>
      </div>
      <div className="w-[100%] flex justify-center ">
        <table className="w-[70%] ">
          <tr>
            <th>
              <input
                title="name"
                type="checkbox"
                checked={checkAll}
                onChange={selectAll}
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions </th>
          </tr>

          {showListOfEmployees()}
        </table>
      </div>
      <div className="w-[70%] flex justify-center  m-auto mt-5">
        <button
          type="button"
          disabled={selectedPage === 1}
          className={`page-buttons ${
            selectedPage === 1 ? "bg-gray-400" : "bg-teal-500"
          } text-white font-bold p-3 m-3 `}
          onClick={() => setSelectedPage(1)}
        >
          {"<<"}
        </button>
        <button
          disabled={selectedPage === 1}
          className={`page-buttons ${
            selectedPage === 1 ? "bg-gray-400" : "bg-teal-500"
          } text-white font-bold p-3 m-3 `}
          type="button"
          onClick={prevPage}
        >
          {"<"}
        </button>
        {pages.map((each: number) => (
          <button
            type="button"
            key={each}
            onClick={() => selectPageNumber(each)}
            className={`page-buttons ${
              selectedPage === each ? "bg-teal-900 " : "bg-teal-500"
            } text-white font-bold p-3 m-3 `}
          >
            {each}
          </button>
        ))}
        <button
          type="button"
          onClick={nextPage}
          disabled={selectedPage === pages.length}
          className={`page-buttons ${
            selectedPage === pages.length ? "bg-gray-400" : "bg-teal-500"
          } text-white font-bold p-3 m-3 `}
        >
          {">"}
        </button>
        <button
          type="button"
          disabled={selectedPage === pages.length}
          className={`page-buttons ${
            selectedPage === pages.length ? "bg-gray-400" : "bg-teal-500"
          } text-white font-bold p-3 m-3 `}
          onClick={() => setSelectedPage(pages.length)}
        >
          {">>"}
        </button>
      </div>
      <Popup
        onChangeEditDetails={onChangeEditDetails}
        saveChanges={saveChanges}
        editDetails={editDetails}
        closeModal={closeModal}
        open={open}
        validateEmail={validateEmail}
      />
    </div>
  );
};

export default HomePage;
