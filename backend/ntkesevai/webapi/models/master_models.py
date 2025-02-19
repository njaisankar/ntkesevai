from django.db import models

class RevenueVillageDetails(models.Model):
    id = models.IntegerField(primary_key=True)
    block_id = models.IntegerField()
    name = models.CharField(max_length=100)
    panchayat_id = models.IntegerField()
    town_panchayat_id = models.IntegerField()
    
    class Meta:
        db_table = 'revenue_village_details'

class HomePageDetails(models.Model):
    id = models.SmallIntegerField(primary_key=True)
    heading = models.CharField(100)
    sub_heading = models.CharField(100)
    content = models.CharField(1000)
    url = models.CharField(100)
    type = models.CharField(20)

    class Meta:
        managed = False
        db_table = 'homepage_details'

class SocialMediaDetails(models.Model):
    id = models.SmallIntegerField(primary_key=True)
    medianame = models.TextField(100)
    logo_url = models.TextField(100)
    url = models.TextField(100)

    class Meta:
        managed = False
        db_table = 'social_media_details'

class ContactDetails(models.Model):
    id = models.SmallIntegerField(primary_key=True)
    heading = models.TextField(100)
    title = models.TextField(10)
    firstname = models.TextField(100)
    lastname = models.TextField(100)
    address1 = models.TextField(100)
    address2 = models.TextField(100)
    address3 = models.TextField(100)
    url = models.TextField(100)
    emailid = models.TextField(100)
    mobile = models.TextField(20)
    subject = models.TextField(100)
    query = models.TextField(1000)
    contact_type = models.TextField(20)

    class Meta:
        managed = False
        db_table = 'contact_details'