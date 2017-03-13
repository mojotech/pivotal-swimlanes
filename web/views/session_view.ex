defmodule PivotalSwimlanes.SessionView do
  use PivotalSwimlanes.Web, :view

  def render("show.json", %{jwt: jwt, user: user}) do
    %{
      jwt: jwt,
      user: user_json(user)
    }
  end

  def render("error.json", _) do
    %{error: "Invalid email or password"}
  end

  def render("delete.json", _) do
    %{ok: true}
  end

  def render("forbidden.json", %{error: error}) do
    %{error: error}
  end

  defp user_json(user) do
    %{
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      pivotalToken: user.pivotal_token || nil,
      githubToken: user.github_token || nil,
      pivotalProjectId: user.pivotal_project_id || nil
    }
  end
end
