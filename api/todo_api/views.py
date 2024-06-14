from rest_framework import generics

from .models import Todo
from .serializers import TodoSerializer


class TodoListApiView(generics.ListCreateAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer


# class TodoListApiView(APIView):
#     # add permission to check if user is authenticated
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = TodoSerializer

#     # 1. List all
#     def get(self, request, *args, **kwargs):
#         """
#         List all the todo items for given requested user
#         """
#         todos = Todo.objects.filter(user=request.user.id)
#         serializer = TodoSerializer(todos, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

#     # 2. Create
#     def post(self, request, *args, **kwargs):
#         """
#         Create the Todo with given todo data
#         """
#         data = {"task": request.data.get("task"), "completed": request.data.get("completed"), "user": request.user.id}
#         serializer = TodoSerializer(data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)