import { Link, useLoaderData } from "react-router-dom";

type Website = {
  id: string,
  label: string,
  url: string,
  regexp: string,
  tags: string[],
  active: boolean
}

export const Websites = () => {
  const websites = useLoaderData() as  Website[];
  console.log(websites);

  const header = ["ID", "label", "url", "regexp", "tags", "active", "action"]

  return (
      <table>
        <thead><tr>{header.map(item => <th scope="col" key={"thead-" + item}>{item}</th>)}</tr></thead>
        <tbody>
          {websites!.map(web => <tr key={"website-" + web.id}>
            <th scope="row">
              {web.id}
            </th>
            <td>
              {web.label}
            </td>
            <td>
              {web.url}
            </td>
            <td>
              {web.regexp}
            </td>
            <td>
              {["tag1", "tag2"].join(",")}
            </td>
            <td>
              {web.active ? "True" : "False"}
            </td>
            <td>
              <Link className="btn btn-info" to={"/websites/" + web.id}>View</Link>
              <Link className="btn btn-primary" to={"/websites/" + web.id + "/edit"}>Edit</Link>
              <Link className="btn btn-danger" to={"/websites/" + web.id + "/delete"}>Delete</Link>
            </td>
          </tr>)}
        </tbody>
      </table>
  );
};
