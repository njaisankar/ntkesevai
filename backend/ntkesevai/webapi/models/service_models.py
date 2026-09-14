from django.db import models

class Service(models.Model):
    service_id = models.AutoField(primary_key=True)
    service_name = models.CharField(max_length=100)

    class Meta:
        managed = True
        db_table = 'service'
          
class ServiceDetails(models.Model):
    service_details_id = models.AutoField(primary_key=True)
    serviceModel = models.ForeignKey(Service, on_delete=models.CASCADE, db_column='service_id')
    name = models.CharField(max_length=100)
    url = models.CharField(max_length=100)

    class Meta:
        managed = True
        db_table = 'service_details'
    
class ServiceLinks(models.Model):
    id = models.AutoField(primary_key=True)
    serviceModel = models.ForeignKey(Service, on_delete=models.CASCADE, db_column='service_id')
    name = models.CharField(max_length=100)
    url = models.CharField(max_length=100)

    class Meta:
        managed = True
        db_table = "service_links"