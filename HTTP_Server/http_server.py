import socket

# Defining the port and host name here
HOST = ""
PORT = 5100

# creating a tcp socket
socket_for_server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

socket_for_server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

# binding the server to specific host and port
socket_for_server.bind((HOST, PORT))

socket_for_server.listen(1)

while True:
    body_input = input("What is the request body? specify here")
    # accept a new client connection
    client_socket, client_address = socket_for_server.accept()
    print(f'Accepted connection from {client_address}')

    # receive the client's request
    request_data = client_socket.recv(1024).decode()
    print(f'Received request: {request_data}')

    # construct the response
    response_body = body_input
    response_headers = [
        'HTTP/1.1 200 OK',
        f'Content-Type: text/plain',
        f'Content-Length: {len(response_body)}',
        '\r\n'
    ]
    response = '\r\n'.join(response_headers) + response_body

    # send the response back to the client
    client_socket.sendall(response.encode())
    print(f'Sent response: {response}')

    # close the connection with the client
    client_socket.close()