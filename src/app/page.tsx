import Image from "next/image";
import { redirect } from "next/navigation";

export default function Home() {

  // redirect to lk
  redirect('/lk');
  return (
    <>
      Hello World!
    </>
  );
}
