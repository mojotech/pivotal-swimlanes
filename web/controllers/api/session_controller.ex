defmodule PivotalSwimlanes.SessionController do
  use PivotalSwimlanes.Web, :controller

  plug :scrub_params, "session" when action in [:create]

  def create(conn, %{"session" => session_params}) do
    case PivotalSwimlanes.Session.authenticate(session_params) do
      {:ok, user} ->
        current_user = user
          {:ok, jwt, _default_claims} = current_user
          |> Guardian.encode_and_sign(:token)

        conn
        |> put_status(:created)
        |> render("show.json", jwt: jwt, user: current_user)

      :error ->
        conn
        |> put_status(:unprocessable_entity)
        |> render("error.json")
    end
  end

  def unauthenticated(conn, _params) do
    conn
    |> put_status(:forbidden)
    |> render(PivotalSwimlanes.SessionView, "forbidden.json", error: "")
  end

  def unauthorized(conn, _params) do
    conn
    |> put_status(:forbidden)
    |> render(PivotalSwimlanes.SessionView, "forbidden.json", error: "Not Authorized")
  end
end
