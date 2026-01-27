const OurHistory = ({ data }) => {
  return (
    <section className="w-full  bg-[#FAF5E78C]">
      <div className=" container-global pt-0">
        <div className="bg-[#F9F9F9] shadow-md py-[2rem] lg:py-[4%] rounded-b-lg lg:rounded-b-[0.5vw] 2xl:rounded-b-lg">
          <h1 className="text-[#ff96c5] text-center">{data?.title}</h1>
        </div>
        <div className="bg-[#F9F9F9] mt-[1rem] lg:mt-[2%] py-[1rem] lg:py-[4%] px-[0.8rem] lg:px-[2%] shadow-md rounded-lg lg:rounded-[0.5vw] 2xl:rounded-lg">
          <div className="space-y-10">
            {data?.content.map((item, index) => (
              <div key={index}>
                {/* Basic heading + description */}
                <div>
                  <h3 className="mb-4">{item?.heading}</h3>
                  <p>{item?.description}</p>
                </div>

                {/* Extra content (conditional) */}
                {item?.contact && (
                  <div className="mt-6 space-y-6">
                    {item.contact.map((subItem, subIndex) => (
                      <div key={subIndex}>
                        <h3 className="mb-2">{subItem?.heading}</h3>

                        {subItem?.name && (
                          <p className="text-gray-700">
                            <strong>Nom :</strong> {subItem.name}
                          </p>
                        )}

                        {subItem?.address && (
                          <p className="text-gray-700">
                            <strong>Adresse :</strong> {subItem.address}
                          </p>
                        )}

                        {subItem?.phone && (
                          <p className="text-gray-700">
                            <strong>Téléphone :</strong> {subItem.phone}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {item.list?.map((section, index) => (
                  <div key={index} className="mb-10 space-y-4">
                    {/* Heading */}
                    <h4 className="font-semibold">{section.heading}</h4>

                    {/* Description (array) */}
                    {Array.isArray(section.description) &&
                      section.description.map((desc, i) => (
                        <p key={i}>{desc}</p>
                      ))}

                    {/* List (optional) */}
                    {Array.isArray(section.list) && (
                      <ul className=" pl-5 space-y-2">
                        {section.list.map((listItem, i) => (
                          <li key={i}><p>{listItem}</p></li>
                        ))}
                      </ul>
                    )}

                    {/* Footer Text (optional) */}
                    {Array.isArray(section.footerText) &&
                      section.footerText.map((text, i) => (
                        <p key={i}>
                          {text}
                        </p>
                      ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurHistory;
