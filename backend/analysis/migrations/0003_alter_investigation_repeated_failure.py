from django.db import migrations, models


def convert_repeated_failure_to_json(apps, schema_editor):
    Investigation = apps.get_model("analysis", "Investigation")
    database = schema_editor.connection.alias

    # Read existing records and convert Boolean values into JSON values.
    for investigation in (
        Investigation.objects.using(database).all().iterator()
    ):
        current_value = investigation.repeated_failure

        if isinstance(current_value, bool):
            investigation.repeated_failure = (
                {"detected": True}
                if current_value
                else {}
            )
            investigation.save(
                using=database,
                update_fields=["repeated_failure"],
            )


class Migration(migrations.Migration):

    dependencies = [
        ("analysis", "0002_alter_investigation_repeated_failure"),
    ]

    operations = [
        # Convert the old Boolean column to JSONB safely.
        migrations.RunSQL(
            sql="""
                ALTER TABLE analysis_investigation
                ALTER COLUMN repeated_failure DROP DEFAULT;

                ALTER TABLE analysis_investigation
                ALTER COLUMN repeated_failure TYPE jsonb
                USING CASE
                    WHEN repeated_failure IS TRUE
                        THEN '{"detected": true}'::jsonb
                    ELSE '{}'::jsonb
                END;

                ALTER TABLE analysis_investigation
                ALTER COLUMN repeated_failure SET DEFAULT '{}'::jsonb;
            """,
            reverse_sql="""
                ALTER TABLE analysis_investigation
                ALTER COLUMN repeated_failure DROP DEFAULT;

                ALTER TABLE analysis_investigation
                ALTER COLUMN repeated_failure TYPE boolean
                USING COALESCE(
                    (repeated_failure->>'detected')::boolean,
                    false
                );

                ALTER TABLE analysis_investigation
                ALTER COLUMN repeated_failure SET DEFAULT false;
            """,
        ),
        migrations.SeparateDatabaseAndState(
            database_operations=[],
            state_operations=[
                migrations.AlterField(
                    model_name="investigation",
                    name="repeated_failure",
                    field=models.JSONField(
                        blank=True,
                        default=dict,
                    ),
                ),
            ],
        ),
    ]