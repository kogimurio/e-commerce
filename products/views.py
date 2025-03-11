from django.shortcuts import render
from rest_framework.response import Response
from .serializers import *
from .models import *
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination


@api_view(['POST'])
def create_product(request):
    serializer = CreateProductSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def list_product(request):
    queryset = Product.objects.all().order_by('-created_at')
    #---Filtering---
    category = request.GET.get('category')
    is_new = request.GET.get('is_new')
    is_discounted = request.GET.get('is_discounted')
    
    if category:
        queryset = queryset.filter(category=category)
        
    if is_new is not None:
        queryset = queryset.filter(is_new=is_new.lower() == 'true')
    
    if is_discounted is not None:
        queryset = queryset.filter(is_discounted=is_discounted.lower() == 'true')
    #---Search---
    search = request.GET.get('search')
    if search:
        queryset = queryset.filter(
            Q(title__icontains=search) |
            Q(description__icontains=search)
        )
    #---Ordering---
    ordering = request.GET.get('ordering')
    if ordering:
        queryset = queryset.order_by(ordering)
    #---Pagination---
    paginator = PageNumberPagination()
    paginator.page_size = 10
    result_page = paginator.paginate_queryset(queryset, request)
    
    serializer = ListProductSerializer(result_page, many=True, context={'request': request})
    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
def detail_product(request, id):
    product = get_object_or_404(Product, id=id)
    serializer = ListProductSerializer(product, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_product(request, id):
    product = get_object_or_404(Product, id=id)
    serializer = ListProductSerializer(product, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['PUT'])
def update_product(request, id):
    product = get_object_or_404(Product, id=id)
    serializer = UpdateProductSerializer(product, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        
        if 'uploaded_images' in request.FILES:
            for image in request.FILES.getlist('uploaded_images'):
                ProductImage.objects.create(product=product, image=image)
                
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_product(request, id):
    product = get_object_or_404(Product, id=id)
    product.delete()
    return Response({'message': 'Product has been deleted'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
def submit_review(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    existing_review = Review.objects.filter(product=product, user=request.user).first()
    
    if existing_review:
        return Response({'message': 'You already reviewed this product'}, status=400)
    
    serializer = ReviewSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(product=product, user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def list_category(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)







