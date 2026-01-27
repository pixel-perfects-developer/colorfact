const OurHistory = ({ data }) => {
  return (
    <section className="w-full bg-[#FAF5E78C]">
      <div className="container-global pt-0">
        <div className=" py-[2rem] lg:py-[2.5%] rounded-b-lg lg:rounded-b-[0.5vw] 2xl:rounded-b-lg">
          <h1 className="text-black text-center">{data?.title}</h1>
        </div>

        <div className="bg-[#F9F9F9]  py-[1rem] lg:py-[4%] px-[1.2rem] lg:px-[2%] shadow-md rounded-lg lg:rounded-[0.5vw] 2xl:rounded-lg">
          <div className="space-y-10 [&_a]:text-[#FFB703] [&_a]:underline">
            {data?.content.map((item, index) => (
              <div key={index}>
                {/* Basic heading + description */}
                <div>
                  <h3 className="mb-4">{item?.heading}</h3>
                  {typeof item?.description === "string" && (
                    <p
                      className="[&_a]:text-[#FFB703] [&_a]:underline"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  )}
                </div>

                {/* Extra content (contact info) */}
                {item?.contact && (
                  <div className="mt-6 space-y-6">
                    {item.contact.map((subItem, subIndex) => (
                      <div key={subIndex}>
                        <h3 className="mb-2">{subItem?.heading}</h3>

                        {subItem?.name && (
                          <p>
                            <strong>Nom :</strong> {subItem.name}
                          </p>
                        )}

                        {subItem?.address && (
                          <p>
                            <strong>Adresse :</strong> {subItem.address}
                          </p>
                        )}

                        {subItem?.phone && (
                          <p>
                            <strong>Téléphone :</strong>{" "}
                            <a href={`tel:${subItem.phone}`}>{subItem.phone}</a>
                          </p>
                        )}

                        {subItem?.email && (
                          <p>
                            <strong>Email :</strong>{" "}
                            <a href={`mailto:${subItem.email}`}>
                              {subItem.email}
                            </a>
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* List sections */}
                {item.list?.map((section, index) => (
                  <div key={index} className="mb-10 space-y-4">
                    <h4 className="font-semibold">{section.heading}</h4>

                    {Array.isArray(section.description) &&
                      section.description.map((desc, i) => (
                        <p key={i} dangerouslySetInnerHTML={{ __html: desc }} />
                      ))}

                    {Array.isArray(section.lists) &&
                      section.lists.map((block, i) => (
                        <div key={i} className="space-y-3">
                          {Array.isArray(block.description) &&
                            block.description.map((text, j) => (
                              <p
                                key={j}
                                dangerouslySetInnerHTML={{ __html: text }}
                              />
                            ))}
                          {Array.isArray(block.items) && (
                            <ul className="pl-[1%] list-disc marker:text-[#FFB703] space-y-2">
                              {block.items.map((item, j) => (
                                <li key={j}>
                                  <p
                                    dangerouslySetInnerHTML={{ __html: item }}
                                  ></p>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
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
