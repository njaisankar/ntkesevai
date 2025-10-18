from django.db import models

class ServiceRequestDetails(models.Model):
    id = models.BigAutoField(primary_key=True)
    service_id = models.BigIntegerField()
    service_details = models.ForeignKey('ServiceDetails', on_delete=models.CASCADE, null=True, blank=True)
    district = models.ForeignKey('DistrictDetails', on_delete=models.CASCADE)
    block = models.ForeignKey('BlockDetails', on_delete=models.CASCADE, null=True, blank=True)
    town_panchayat = models.ForeignKey('TownPanchayatDetails', on_delete=models.CASCADE, null=True, blank=True)
    panchayat = models.ForeignKey('PanchayatDetails', on_delete=models.CASCADE, null=True, blank=True)
    village_street = models.ForeignKey('VillageStreetDetails', on_delete=models.CASCADE, null=True, blank=True)
    ward_number = models.CharField(max_length=50)
    address_line1 = models.CharField(max_length=100)
    street_name = models.CharField(max_length=100, blank=True, null=True)
    shop_num = models.CharField(max_length=20, blank=True, null=True)
    ref_number = models.CharField(max_length=20, blank=True, null=True)
    document_attachment = models.FileField(upload_to='media/', max_length=200, blank=True, null=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    registered_mobile = models.CharField(max_length=15)
    contact_mobile = models.CharField(max_length=15, blank=True, null=True)
    email_id = models.CharField(max_length=50)
    amount = models.TextField()  # This field type is a guess.
    status = models.CharField(max_length=50, blank=True, null=True)
    created_by = models.CharField(max_length=50, blank=True, null=True)
    created_date = models.CharField(max_length=50, blank=True, null=True)
    updated_by = models.CharField(max_length=50, blank=True, null=True)
    updated_date = models.CharField(max_length=50, blank=True, null=True)
    approved_by = models.CharField(max_length=50, blank=True, null=True)
    approved_date = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        manage: False
        db_table = 'service_request_details'