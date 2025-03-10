from django.urls import path
from .import views

urlpatterns = [
    path('list_products/', views.list_product, name='product-list'),
    path('create_product/', views.create_product, name='product-create'),
    path('product_detail/<int:id>/', views.detail_product, name='product-detail'),
    path('get_product/<int:id>/', views.get_product, name='get-product'),
    path('update_product/<int:id>/', views.update_product, name='update-product'),
    path('delete_product/<int:id>/', views.delete_product, name='delete-product'),
]