import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getActiveSessions,
  getUserByName,
  loginUser,
  uniqueId,
} from "../utils";

const Login = ({ setUserExist }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState();

  const login = () => {
    let users = getActiveSessions() || [];

    let ifUserExist = getUserByName(username);
    if (ifUserExist) {
      setUserExist(ifUserExist.name);
    } else {
      setUserExist();
      let user = {
        id: uniqueId(),
        name: username,
        status: "active",
      };

      users.push(user);

      loginUser(users);

      navigate(`?id=${user.id}`);
      window.location.reload();
    }
  };
  return (
    <div className="container mb-5">
      <div className="row">
        <div className="col-md-5">
          <div className=" auth_form shadow p-4">
            <form>
              <label htmlFor="Username">Username</label>
              <input
                placeholder="Enter username"
                className="form-control"
                required
                onChange={(e) => setUsername(e.target.value)}
              />

              <button
                type="button"
                className="btn btn-primary btn-md btn-block mt-4"
                onClick={login}
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
