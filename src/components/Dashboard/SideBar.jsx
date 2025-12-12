export default function SideBar() {

  return (
    <div className="">
       <Link href="/" className="flex items-center">
            <Image
              src={"/header.png"}
              alt="ColorFact logo"
              width={120}
              height={120}
              priority
              className="object-contain w-[80px] md:w-[70px] lg:w-[120px]"
            />
          </Link>

    </div>
  );
}
  