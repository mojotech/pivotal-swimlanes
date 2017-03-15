defmodule PivotalSwimlanes.UserTest do
  use PivotalSwimlanes.ModelCase

  alias PivotalSwimlanes.User

  @valid_attrs %{email: "some content", first_name: "some content", github_token: "some content", last_name: "some content", pivotal_project_id: 42, pivotal_token: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = User.update_changeset(%User{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = User.changeset(%User{}, @invalid_attrs)
    refute changeset.valid?
  end
end
