import React from "react";
//import { useLocation } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Avatar from "@mui/material/Avatar";

import dashbaordImg from "../../assets/images/elec_receipt.png";

export default function UserList() {
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "user",
      headerName: "User",
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <Avatar src={params.value.avatar} />
            {params.value.username}
          </>
        );
      },
    },
    { field: "email", headerName: "E-mail", width: 130 },
    {
      field: "status",
      headerName: "Status",
      width: 90,
    },
 
    {
      field: "transaction",
      headerName: "Transaction",
      width: 100,
    },
  ];


  const rows = [
    {
      id: 1,
      user: {
        username: "Harry Potter",
        avatar:
          "data:image/png;base64,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",
      },
      email: "Harry@gmail.com",
      status: "Active",
      transaction: "$120",
    },
  ];

  return (
    <>
      <img
        className="align-self-center"
        src={dashbaordImg}
        alt="Dashboard"
        style={{ width: "30px", height: "30px" }}
      />
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </>
  );
}
