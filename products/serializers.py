from rest_framework import serializers
from .models import *

class ImageProductSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image_url']
        
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url if obj.image else None

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'user', 'rating', 'comment', 'created_at'] 

class CreateProductSerializer(serializers.ModelSerializer):
    images = ImageProductSerializer(many=True, required=False)
    uploaded_images = serializers.ListField(child=serializers.ImageField(), write_only=True, required=False)
    rating = serializers.FloatField(read_only=True)
    reviews = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Product
        fields = ['title', 'price', 'original_price', 'discount',
                  'is_discounted', 'is_new', 'rating', 'review',
                  'description', 'stock', 'category', 'images', 'uploaded_images'
                  ]
    
    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        product = Product.objects.create(**validated_data)
        
        for images in uploaded_images:
            ProductImage.objects.create(product=product, image=images)
        return product



class ListProductSerializer(serializers.ModelSerializer):
    images = ImageProductSerializer(many=True, read_only=True)
    category = serializers.StringRelatedField()
    rating = serializers.FloatField(read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True, source='product_reviews')
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    
    def get_average_rating(self, obj):
        return round(obj.product_reviews.aggregate(avg=models.Avg('rating'))['avg'] or 0,1 )
    
    def get_review_count(self, obj):
        return obj.product_reviews.count()
 
    
    class Meta:
        model = Product
        fields = ['id', 'title', 'slug', 'price', 'original_price', 'discount',
                  'is_discounted', 'is_new', 'rating', 'reviews',
                  'description', 'stock', 'category', 'images', 'created_at',
                    'average_rating', 'review_count'
                ]

    
class UpdateProductSerializer(serializers.ModelSerializer):
    images = ImageProductSerializer(many=True, required=True)
    uploaded_images = serializers.ListField(child=serializers.ImageField(), write_only=True, required=False)
    rating = serializers.FloatField(read_only=True)
    reviews = serializers.IntegerField(read_only=True)

    class Meta:
        model = Product
        fields = ['title', 'price', 'original_price', 'discount',
                  'is_discounted', 'is_new', 'rating', 'review',
                  'description', 'stock', 'category', 'images', 'uploaded_images'
                  ]
        
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']
        
        
    
    
