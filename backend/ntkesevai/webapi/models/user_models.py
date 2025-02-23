from django.db import models
from django.contrib.auth.models import User

class UserDetails(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    mobile = models.CharField(max_length=100)

    def __str__(self):
        return self.mobile
    class Meta:
        managed = True
        db_table = 'UserDetails'
