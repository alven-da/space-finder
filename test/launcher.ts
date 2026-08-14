// import { handler } from "../src/services/hello";

import { handler } from "../src/services/spaces/handler";

handler({
    httpMethod: "POST",
    body: JSON.stringify({ location: "Hong Kong updated" }),
} as any, {} as any).then(response => {
    console.log("Response:", response);
}).catch(error => {
    console.error("Error:", error);
});

// handler({
//     httpMethod: "GET",
//     // queryStringParameters: { id: "0d0464c8-fdb2-4a7a-9142-b3a78993bfcf" },
// } as any, {} as any);

// handler({
//     httpMethod: "PUT",
//     body: JSON.stringify({
//         location: "Chongqing"
//     }),
//     queryStringParameters: { id: "0d0464c8-fdb2-4a7a-9142-b3a78993bfcf" },
// } as any, {} as any);

// handler({
//     httpMethod: "DELETE",
//     queryStringParameters: { id: "0d0464c8-fdb2-4a7a-9142-b3a78993bfcf" },
// } as any, {} as any);