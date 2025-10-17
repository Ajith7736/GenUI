import React from 'react'

function Preview({ jsxgeneratedcode }: { jsxgeneratedcode: string }) {
    return (
        < div className=" h-[53.5vh] rounded-b-md bg-light-lightgrey dark:bg-dark-input-box overflow-auto">
            {
                jsxgeneratedcode ?
                    < iframe
                        className="w-full h-[53.5vh] border-0 transition-all ease-in-out"
                        srcDoc={`
                        <html>
                          <head>
                                  <script>
                                    document.addEventListener('click', (e) => {
                                      if(e.target.tagName === 'A') {
                                        e.preventDefault();
                                      }
                                    });
                                  </script>
                             <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
                            </head>
                          <body>${jsxgeneratedcode}</body>
                        </html>
                      `}
                    />

                    : <div className="m-6 xss:text-sm sm:text-base">No preview to show.</div>
            }
        </div>
    )
}

export default Preview
