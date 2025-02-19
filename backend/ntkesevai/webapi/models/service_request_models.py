from django.db import models

class ServiceRequestDetails(models.Model):
    id = models.SmallIntegerField(primary_key=True)
    service_detail_id = models.SmallIntegerField()
    district_id = models.SmallIntegerField()
    block_id = models.SmallIntegerField()
    panchayat_id = models.SmallIntegerField(blank=True, null=True)
    town_panchayat_id = models.SmallIntegerField(blank=True, null=True)
    revenue_village_id = models.SmallIntegerField()
    village_name = models.CharField(max_length=100)
    address_line1 = models.CharField(max_length=100)
    street_name = models.CharField(max_length=100)
    job_num = models.CharField(max_length=20, blank=True, null=True)
    shop_num = models.CharField(max_length=20, blank=True, null=True)
    ref_number = models.CharField(max_length=20, blank=True, null=True)
    document_attachment = models.CharField(max_length=200, blank=True, null=True)
    first_name = models.CharField(max_length=50)
    fast_name = models.CharField(max_length=50)
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