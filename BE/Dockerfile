# Χρήση του επίσημου image για .NET 9 SDK (για το χτίσιμο)
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Αντιγραφή των αρχείων project και restore dependencies
COPY ["GoodPills.csproj", "./"]
RUN dotnet restore "GoodPills.csproj"

# Αντιγραφή όλων των αρχείων και build
COPY . .
RUN dotnet publish "GoodPills.csproj" -c Release -o /app/publish

# Τελικό στάδιο: Εικόνα Runtime (πιο ελαφριά, μόνο για εκτέλεση)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Ρύθμιση της πόρτας που περιμένει το Render
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "GoodPills.dll"]