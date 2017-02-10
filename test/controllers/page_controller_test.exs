defmodule PivotalSwimlanes.PageControllerTest do
  use PivotalSwimlanes.ConnCase

  test "GET /", %{conn: conn} do
    conn = get conn, "/"
    assert html_response(conn, 200) =~ "Swimlanes"
  end
end
