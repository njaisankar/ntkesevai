from django.db import models

# Create your models here.
class DistrictDetails(models.Model):
    district_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'district_details'
