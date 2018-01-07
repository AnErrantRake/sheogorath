#ad-hoc script to copy random files from a directory into another directory
#until the second directory reaches a desired size
#desired size must be smaller than original directory - will not write duplicates
#for assembling smaller random libraries from larger ones

$inputDirectory = "E:\UpdatedComboMix"
$outputDirectory = "C:\Users\Talos\Music\ModComboMix"
$desiredSizeinGB = 3.4

# copy random files until output directory size is less than or equal to desired size
while((Get-ChildItem -Path $outputDirectory | Measure-Object -property length -sum).sum / 1GB -lt $desiredSizeinGB){
    #get random file in inputdirectory
    $itemVar = Get-ChildItem -name $inputDirectory | Select-Object -index $(Random $((Get-ChildItem $inputDirectory).Count))
    
    #ensure file is new
    while(Test-Path ($outputDirectory + "\" + $itemVar)){
        $itemVar = Get-ChildItem -name $inputDirectory | Select-Object -index $(Random $((Get-ChildItem $inputDirectory).Count))
    }
    
    #write file to new directory
    Copy-Item ($inputDirectory + "\" + $itemVar) $outputDirectory
}

#from technet https://technet.microsoft.com/en-us/library/ff730945.aspx
$colItems = (Get-ChildItem -Path $outputDirectory | Measure-Object -property length -sum).sum / 1GB -le $desiredSizeinGB
$outputDirectory + "is now " + "{0:N2}" -f ($colItems.sum / 1GB) + " GB"
