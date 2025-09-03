from django.db import models

class ServiceRequestDetails(models.Model):
    id = models.BigAutoField(primary_key=True)
    service_id = models.SmallIntegerField()
    district_id = models.SmallIntegerField()
    block_id = models.SmallIntegerField()
    panchayat_id = models.SmallIntegerField(blank=True, null=True)
    town_panchayat_id = models.SmallIntegerField(blank=True, null=True)
    ward_number = models.CharField(max_length=50)
    village_street_id = models.BigIntegerField(blank=True, null=True)
    address_line1 = models.CharField(max_length=100)
    street_name = models.CharField(max_length=100)
    service_details_id = models.SmallIntegerField()
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