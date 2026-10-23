from django.urls import path

from .views import (
    health_check,
    upload_logs,
    ai_chat,
    register_user,
    login_user,
    forgot_password,
    investigation_list,
    investigation_detail,
    reset_password,
)

urlpatterns = [
    path("health/",health_check,name="health-check",),
    path("analysis/upload/",upload_logs,name="upload-logs",),
    path("investigations/",investigation_list,name="investigation-list",),
    path("investigations/<str:investigation_id>/",investigation_detail,name="investigation-detail",),
    path("ai/chat/",ai_chat,name="ai-chat"),
    path("auth/register/",register_user,name="register",),
    path("auth/login/",login_user,name="login"),
    path("auth/forgot-password/",forgot_password,name="forgot-password"),
    path("auth/reset-password/",reset_password,name="reset-password"),
]