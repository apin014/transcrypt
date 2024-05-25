
import { Button, Navbar } from "flowbite-react";
import 'flowbite/dist/flowbite.css';
export function Sidebar () {
  return (
    <Navbar fluid rounded>
      <Navbar.Brand>
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">TransCrypt</span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Button className="bg-blue-700">Documentation</Button>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="#" active>
          Home
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
