from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Event, Booking

# ── Admin site branding ──────────────────────────────────────────────────────
admin.site.site_header  = "EventFlow Administration"
admin.site.site_title   = "EventFlow Admin"
admin.site.index_title  = "Platform Dashboard"


# ── User ─────────────────────────────────────────────────────────────────────
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display  = ("username", "email", "name", "role", "is_active", "date_joined")
    list_filter   = ("role", "is_active", "is_staff")
    search_fields = ("username", "email", "name")
    ordering      = ("-date_joined",)
    list_per_page = 25

    fieldsets = BaseUserAdmin.fieldsets + (
        ("EventFlow Profile", {"fields": ("name", "role")}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("EventFlow Profile", {"fields": ("name", "role")}),
    )


# ── Event ─────────────────────────────────────────────────────────────────────
@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display  = ("title", "category", "organizer", "date", "price",
                     "total_seats", "booked_seats", "available_seats_display")
    list_filter   = ("category", "date")
    search_fields = ("title", "location", "organizer__username")
    ordering      = ("-date",)
    list_per_page = 25
    date_hierarchy = "date"
    readonly_fields = ("booked_seats", "created_at")

    fieldsets = (
        ("Event Details", {
            "fields": ("title", "description", "category", "image_url")
        }),
        ("Location & Timing", {
            "fields": ("location", "date")
        }),
        ("Capacity & Pricing", {
            "fields": ("total_seats", "booked_seats", "price")
        }),
        ("Organizer", {
            "fields": ("organizer", "created_at")
        }),
    )

    @admin.display(description="Available Seats")
    def available_seats_display(self, obj):
        return obj.available_seats


# ── Booking ───────────────────────────────────────────────────────────────────
@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display  = ("id", "user", "event", "status", "booked_at")
    list_filter   = ("status", "booked_at")
    search_fields = ("user__username", "user__email", "event__title")
    ordering      = ("-booked_at",)
    list_per_page = 25
    date_hierarchy = "booked_at"
    readonly_fields = ("booked_at",)
