from uuid import uuid4
from django.db import models


class Investigation(models.Model):
    investigation_id = models.CharField(
        max_length=20,
        unique=True,
        editable=False,
    )

    title = models.CharField(
        max_length=200,
        default="Log Investigation",
    )

    uploaded_files = models.JSONField(
        default=list,
        blank=True,
    )

    suspicious_events = models.JSONField(
        default=list,
        blank=True,
    )

    repeated_failure = models.JSONField(
        default=dict,
        blank=True,
    )

    investigation_summary = models.TextField(
        blank=True,
        default="",
    )

    attack_classification = models.CharField(
        max_length=200,
        blank=True,
        default="",
    )

    risk_level = models.CharField(
        max_length=30,
        default="Unknown",
    )

    evidence = models.JSONField(
        default=list,
        blank=True,
    )

    explanation = models.TextField(
        blank=True,
        default="",
    )

    recommended_actions = models.JSONField(
        default=list,
        blank=True,
    )

    limitations = models.JSONField(
        default=list,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def save(self, *args, **kwargs):
        if not self.investigation_id:
            self.investigation_id = (
                f"INV-{uuid4().hex[:12].upper()}"
            )

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.investigation_id} - {self.title}"

    class Meta:
        ordering = ["-created_at"]