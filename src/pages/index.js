import React, { useState, useEffect } from "react";
import {
  changeUserStatus,
  getActiveSessions,
  getUserById,
  logoutUser,
  revokeUser,
} from "../utils";
import IdleTimer from "../idleTimer";
import { useNavigate } from "react-router-dom";
import Login from "./login";

const Dashboard = () => {
  const navigate = useNavigate();

  const queryString = window.location.search;
  const parameters = new URLSearchParams(queryString);
  const currentId = parameters.get("id");

  let current = currentId !== null && getUserById(Number(currentId));
  const [userExist, setUserExist] = useState();
  const [activeSessions, setActiveSessions] = useState(
    currentId !== null ? getActiveSessions(Number(currentId)) : []
  );

  const login = () => {
    navigate("/");
    window.location.reload();
  };

  const logout = () => {
    logoutUser(Number(currentId));
    navigate("/");
    window.location.reload();
  };

  const revoke = (id) => {
    revokeUser(Number(id));
    let response = getActiveSessions(Number(currentId));
    setActiveSessions(response);
  };

  useEffect(() => {
    setInterval(() => {
      let response = getActiveSessions(Number(currentId));
      setActiveSessions(response);
    }, 1000);
  }, [currentId]);

  useEffect(() => {
    const timer = new IdleTimer({
      timeout: 60, //expire after 60 seconds
      onTimeout: () => {
        currentId !== null && changeUserStatus(currentId);
      },
      onExpired: () => {
        // currentId !== null && changeUserStatus(currentId);
      },
    });

    return () => {
      timer.cleanUp();
    };
  }, [currentId]);

  return (
    <div className="auth_wrapper dashboard">
      <div className="container py-5 ">
        <div className="row">
          {current?.name ? (
            <>
              <div className="col-md-12 d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-primary btn-sm mr-3"
                  onClick={login}
                >
                  Login
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>

              <div className="col-md-12 my-4">
                <div className="card border-0 shadow py-4 bg-welcome">
                  <div className="card-body">
                    <h4> Hello, {current?.name} 😇</h4>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Login setUserExist={setUserExist} />
          )}

          {activeSessions?.length > 0 && (
            <div className="col-md-12">
              <div className="card border-0 shadow pb-3">
                <div className="card-body">
                  <h6>Manage Sessions</h6>
                  <small>
                    This is a list of devices that have logged into your
                    browser. Revoke any sessions that you do not recognize.
                  </small>
                  <ul className="list-group mt-3">
                    {activeSessions?.map((item, i) => {
                      return (
                        <li
                          className={`${
                            userExist === item?.name ? "bg-info text-white" : ""
                          } list-group-item d-flex justify-content-between align-items-center `}
                          key={i}
                        >
                          <div>
                            {item?.name}&nbsp;&nbsp;
                            <span
                              className={`badge ${
                                item?.status === "active"
                                  ? "badge-success"
                                  : "badge-warning"
                              } text-white badge-pill`}
                            >
                              {item?.status === "active" ? "Active" : "Idle"}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => revoke(item?.id)}
                          >
                            Revoke
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
